"use client";

import { type Dispatch, type SetStateAction, useEffect } from "react";

type OtpCredential = Credential & {
  code: string;
};

type WebOtpRequestOptions = CredentialRequestOptions & {
  otp: {
    transport: ["sms"];
  };
};

export function useWebOtp(
  setCode: Dispatch<SetStateAction<string>>,
  minCodeLength: number,
  maxCodeLength = minCodeLength,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled || !("OTPCredential" in window) || !navigator.credentials) return;

    const controller = new AbortController();
    const options: WebOtpRequestOptions = {
      otp: { transport: ["sms"] },
      signal: controller.signal,
    };

    navigator.credentials
      .get(options)
      .then((credential) => {
        const code = (credential as OtpCredential | null)?.code
          ?.replace(/\D/g, "")
          .slice(0, maxCodeLength);

        if (code && code.length >= minCodeLength) setCode(code);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        // Reading an SMS can be declined or time out; manual entry remains available.
      });

    return () => controller.abort();
  }, [enabled, maxCodeLength, minCodeLength, setCode]);
}
