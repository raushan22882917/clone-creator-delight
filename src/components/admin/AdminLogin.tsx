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

  const handleSendOTP = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;

      toast({
        title: "OTP Sent",
        description: "Please check your WhatsApp for the verification code.",
      });
      setShowOtpInput(true);
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
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full"
          />
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