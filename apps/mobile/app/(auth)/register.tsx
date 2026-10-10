import { useRouter } from "expo-router";
import { RegisterSchema } from "@rnp/shared";
import { Logo } from "@/components/Logo";
import { Body, Button, Display, ErrorBox, Gap, Glass, Input, Row, Screen, TextButton } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function Register() {
  const router = useRouter();
  const form = useAuthForm(RegisterSchema, (input) => container.auth.register(input));

  return (
    <Screen>
      <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
        <Logo size={36} />
        <TextButton label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} />
      </Row>
      <Gap size="lg" />
      <Display>Create your account</Display>
      <Body muted>Takes thirty seconds. Your first lesson takes ten minutes.</Body>
      <Gap size="sm" />
      <Glass strong>
        {form.error ? <ErrorBox message={form.error} /> : null}
        <Input label="Name" autoComplete="name" placeholder="What should we call you?" value={form.values.name ?? ""} onChangeText={form.set("name")} />
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="you@college.edu"
          value={form.values.email ?? ""}
          onChangeText={form.set("email")}
        />
        <Input
          label="Password"
          secureTextEntry
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.values.password ?? ""}
          onChangeText={form.set("password")}
          onSubmitEditing={form.onSubmit}
        />
        <Gap size="xs" />
        <Button label="Create account" onPress={form.onSubmit} loading={form.loading} />
      </Glass>
      <TextButton label="Already have an account? Sign in" onPress={() => router.replace("/(auth)/login")} />
    </Screen>
  );
}
