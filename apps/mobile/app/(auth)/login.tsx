import { useRouter } from "expo-router";
import { LoginSchema } from "@rnp/shared";
import { Logo } from "@/components/Logo";
import { Body, Button, Display, ErrorBox, Gap, Glass, Input, Row, Screen, TextButton } from "@/components/ui";
import { container } from "@/core/AppContainer";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function Login() {
  const router = useRouter();
  const form = useAuthForm(LoginSchema, (input) => container.auth.login(input));

  return (
    <Screen>
      <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
        <Logo size={36} />
        <TextButton label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} />
      </Row>
      <Gap size="lg" />
      <Display>Welcome back</Display>
      <Body muted>Your streak is waiting.</Body>
      <Gap size="sm" />
      <Glass strong>
        {form.error ? <ErrorBox message={form.error} /> : null}
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
          autoComplete="password"
          placeholder="Your password"
          value={form.values.password ?? ""}
          onChangeText={form.set("password")}
          onSubmitEditing={form.onSubmit}
        />
        <Gap size="xs" />
        <Button label="Sign in" onPress={form.onSubmit} loading={form.loading} />
      </Glass>
      <TextButton label="New here? Create an account" onPress={() => router.replace("/(auth)/register")} />
    </Screen>
  );
}
