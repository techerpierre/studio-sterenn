"use client";

import { validate2fa } from "@/actions/auth.actions";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { OTPInput } from "@/components/ui/OTPInput";
import { Text } from "@/components/ui/Text";
import { useActionFeedback } from "@/hooks/useActionFeedback";
import {
  Validate2faSchema,
  validate2faSchema,
} from "@/validation/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export function Validate2FAForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { run } = useActionFeedback();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Validate2faSchema>({
    resolver: zodResolver(validate2faSchema),
    defaultValues: {
      pinCode: "",
    },
  });

  const onSubmit = async (data: Validate2faSchema) => {
    const ok = await run(
      async () => {
        await validate2fa(data);
        return true;
      },
      {
        errorTitle: "Code invalide",
        errorDescription: "Le code de vérification est incorrect ou expiré.",
      },
    );
    if (!ok) return;

    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    router.push(callbackUrl);
  };

  return (
    <Box
      as="form"
      direction="column"
      gap={32}
      padding={16}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box direction="column" gap={16}>
        <Text.ThirdHeading as="h1">Vérification en deux étapes</Text.ThirdHeading>
        <Text.FourthHeading as="h2">
          Entrez le code à 6 chiffres envoyé par email
        </Text.FourthHeading>
      </Box>
      <FormField
        label="Code de vérification"
        caption="Le code expire après quelques minutes"
        error={errors.pinCode?.message}
        htmlFor="pinCode"
      >
        <Controller
          name="pinCode"
          control={control}
          render={({ field }) => (
            <OTPInput
              id="pinCode"
              length={6}
              value={field.value}
              onChange={field.onChange}
              autoFocus
              disabled={isSubmitting}
            />
          )}
        />
      </FormField>
      <Button type="submit" loading={isSubmitting}>
        Envoyer
      </Button>
    </Box>
  );
}
