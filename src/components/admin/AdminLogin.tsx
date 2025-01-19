import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Check if the number already has a country code
    if (digits.startsWith('91')) {
      return `+${digits}`;
    }
    
    // Add Indian country code if not present
    return `+91${digits}`;
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^\+91[1-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async () => {
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      if (!validatePhoneNumber(formattedPhone)) {
        toast({
          variant: "destructive",
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit Indian phone number.",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast({
        title: "OTP Sent",
        description: "Please check your WhatsApp for the verification code.",
      });
      setShowOtpInput(true);
      setPhoneNumber(formattedPhone); // Store the formatted number
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      // After successful verification, create admin user record
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([
          {
            user_id: data.user?.id,
            phone_number: phoneNumber,
            is_verified: true
          }
        ]);

      if (adminError) throw adminError;

      toast({
        title: "Success",
        description: "Admin verified successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      <div className="space-y-4">
        <div>
          <Input
            type="tel"
            placeholder="Enter phone number (e.g., 9999999999)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter 10 digits without country code. +91 will be added automatically.
          </p>
        </div>
        
        {!showOtpInput ? (
          <Button onClick={handleSendOTP} className="w-full">
            Send OTP
          </Button>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleVerifyOTP} className="w-full">
              Verify OTP
            </Button>
          </>
        )}
      </div>
    </div>
  );
};