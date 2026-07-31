"use client";

import { register } from "@/actions/auth.actions";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Text } from "@/components/ui/Text";
import { TextInput } from "@/components/ui/TextInput";
import { useToast } from "@/components/ui/Toast";
import { RegisterSchema, registerSchema } from "@/validation/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await register(data);
      const nextUrl = new URL("/validate-2fa", window.location.origin);
      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
      nextUrl.searchParams.set("callbackUrl", callbackUrl);
      router.push(nextUrl.toString());
    } catch (error) {
      console.error(error);
      toast({
        title: "Inscription échouée",
        description: "Impossible de créer le compte. Réessayez.",
        variant: "danger",
      });
    }
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
        <Text.ThirdHeading as="h1">
          Gérez vos projets simplement
        </Text.ThirdHeading>
        <Text.FourthHeading as="h2">Créer un compte</Text.FourthHeading>
      </Box>
      <Box direction="column" gap={16}>
        <Box gap={16}>
          <FormField
            label="Prénom"
            caption="Entrez votre prénom"
            error={errors.firstName?.message}
          >
            <TextInput
              type="text"
              placeholder="John"
              autoComplete="given-name"
              {...registerField("firstName")}
            />
          </FormField>
          <FormField
            label="Nom"
            caption="Entrez votre nom"
            error={errors.lastName?.message}
          >
            <TextInput
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              {...registerField("lastName")}
            />
          </FormField>
        </Box>
        <FormField
          label="Email"
          caption="Entrez votre email"
          error={errors.email?.message}
        >
          <TextInput
            type="email"
            placeholder="john.doe@example.com"
            autoComplete="email"
            {...registerField("email")}
          />
        </FormField>
        <FormField
          label="Mot de passe"
          caption="Au moins 8 caractères"
          error={errors.password?.message}
        >
          <TextInput
            type="password"
            autoComplete="new-password"
            {...registerField("password")}
          />
        </FormField>
        <FormField
          label="Confirmer le mot de passe"
          caption="Retapez votre mot de passe"
          error={errors.confirmPassword?.message}
        >
          <TextInput
            type="password"
            autoComplete="new-password"
            {...registerField("confirmPassword")}
          />
        </FormField>
      </Box>
      <Box direction="column" gap={16}>
        <Button type="submit" loading={isSubmitting}>
          Créer mon compte
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/sign-in")}
        >
          Déjà un compte ? Se connecter
        </Button>
      </Box>
    </Box>
  );
}

