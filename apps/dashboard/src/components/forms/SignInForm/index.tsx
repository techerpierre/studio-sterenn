"use client";

import { signIn } from "@/actions/auth.actions";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Text } from "@/components/ui/Text";
import { TextInput } from "@/components/ui/TextInput";
import { SignInSchema, signInSchema } from "@/validation/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/Toast";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInSchema) => {
    try {
      await signIn(data);
      const nextUrl = new URL("/validate-2fa", window.location.origin);
      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
      nextUrl.searchParams.set("callbackUrl", callbackUrl);
      router.push(nextUrl.toString());
    } catch (error) {
      console.error(error);
      toast({
        title: "Connexion échouée",
        description: "Email ou mot de passe incorrect",
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
        <Text.FourthHeading as="h2">Se connecter</Text.FourthHeading>
      </Box>
      <Box direction="column" gap={16}>
        <FormField
          label="Email"
          caption="Entrez votre email"
          error={errors.email?.message}
        >
          <TextInput
            type="email"
            placeholder="john.doe@example.com"
            autoComplete="email"
            {...register("email")}
          />
        </FormField>
        <FormField
          label="Mot de passe"
          caption="Entrez votre mot de passe (au moins 8 caractères)"
          error={errors.password?.message}
        >
          <TextInput
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>
      </Box>
      <Box direction="column" gap={16}>
        <Button type="submit" loading={isSubmitting}>
          Se connecter
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/sign-up")}
        >
          Pas encore inscrit ? Créer un compte
        </Button>
      </Box>
    </Box>
  );
}
