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

      const response = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ phone: formattedPhone }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      });
      setShowOtpInput(true);
      setPhoneNumber(formattedPhone);
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

      // First verify with Twilio
      const verifyResponse = await fetch(
        `${process.env.SUPABASE_URL}/functions/v1/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ phone: phoneNumber, code: otp }),
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Failed to verify OTP');
      }

      // If verification successful, sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password: otp,
      });

      if (error) throw error;

      // Create admin user record
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
      console.error('Verification Error:', error);
      if (error.message.includes('expired')) {
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
            disabled={isLoading}
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