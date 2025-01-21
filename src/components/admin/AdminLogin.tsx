import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('91')) {
      return `+${digits}`;
    }
    return `+91${digits}`;
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+91[1-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      if (!validatePhoneNumber(formattedPhone)) {
        toast({
          variant: "destructive",
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit Indian phone number.",
        });
        return;
      }

      // Check if the phone number belongs to an admin
      const { data: adminData, error: adminCheckError } = await supabase
        .from('admin_data')
        .select('*')
        .eq('phone_number', formattedPhone)
        .single();

      if (!adminData) {
        toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "This phone number is not registered as an admin.",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
      setShowOtpInput(true);
      setPhoneNumber(formattedPhone);

      // Update login attempts
      await supabase
        .from('admin_data')
        .update({ 
          login_attempts: (adminData.login_attempts || 0) + 1 
        })
        .eq('phone_number', formattedPhone);

    } catch (error: any) {
      console.error('OTP Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      // Update admin data
      const { error: updateError } = await supabase
        .from('admin_data')
        .update({ 
          is_verified: true,
          last_login: new Date().toISOString()
        })
        .eq('phone_number', phoneNumber);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Admin verified successfully!",
      });
    } catch (error: any) {
      console.error('Verification Error:', error);
      if (error.message?.includes('expired')) {
        toast({
          variant: "destructive",
          title: "OTP Expired",
          description: "The verification code has expired. Please request a new one.",
        });
        setOtp("");
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
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
            disabled={isLoading || showOtpInput}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter 10 digits without country code. +91 will be added automatically.
          </p>
        </div>
        
        {!showOtpInput ? (
          <Button 
            onClick={handleSendOTP} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
            <div className="space-y-2">
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button 
                onClick={() => {
                  setOtp("");
                  handleSendOTP();
                }} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};