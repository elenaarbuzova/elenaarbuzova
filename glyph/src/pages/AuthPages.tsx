import { useState, type ComponentProps } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Input';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

/** Keep auth fields readable even when the app theme is dark */
const authInputClass =
  'border-black/15 bg-white text-black placeholder:text-zinc-400 dark:border-black/15 dark:bg-white dark:text-black dark:placeholder:text-zinc-400 dark:focus:border-accent/50 dark:focus:ring-accent/10';

const authBtnClass =
  'bg-black text-white hover:bg-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-800';

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-16 text-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,77,46,0.08),transparent_55%)]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative w-full max-w-md"
      >
        <Link href="/">
          <Logo variant="light" />
        </Link>
        <h1 className="mt-12 font-display text-3xl font-semibold tracking-tight text-black">
          {title}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">{subtitle}</p>
        <div className="mt-10">{children}</div>
      </motion.div>
    </div>
  );
}

function AuthInput(props: ComponentProps<typeof Input>) {
  return <Input {...props} className={cn(authInputClass, props.className)} />;
}

export function LoginPage() {
  const { signIn } = useApp();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('dr.chen@helixbio.lab');
  const [name] = useState('Dr. Chen');

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your workspace."
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          signIn({ name, email });
          setLocation('/app');
        }}
      >
        <Field label="Work email">
          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@lab.org"
          />
        </Field>
        <Field label="Password">
          <AuthInput type="password" defaultValue="••••••••" />
        </Field>
        <Button
          type="submit"
          variant="primary"
          className={cn('w-full', authBtnClass)}
          size="lg"
        >
          Sign in
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-zinc-500">
        New to LabAgent?{' '}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Create account
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-zinc-400">
        Demo: any email and password open the Helix Bio sample workspace.
      </p>
    </AuthShell>
  );
}

export function SignupPage() {
  const { signUp } = useApp();
  const [, setLocation] = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <AuthShell
      title="Create a workspace"
      subtitle="Upload documents. Ask questions. Answers cite your files."
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          signUp({
            name: name || 'Researcher',
            email: email || 'you@lab.org',
          });
          setLocation('/onboarding/welcome');
        }}
      >
        <Field label="Full name">
          <AuthInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Ada Lovelace"
          />
        </Field>
        <Field label="Work email">
          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@lab.org"
          />
        </Field>
        <Field label="Password">
          <AuthInput type="password" placeholder="Create a password" />
        </Field>
        <Button
          type="submit"
          variant="primary"
          className={cn('w-full', authBtnClass)}
          size="lg"
        >
          Create account
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
