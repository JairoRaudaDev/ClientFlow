import type { Metadata } from 'next';
import Link from 'next/link';

import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <Card className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-foreground text-xl font-semibold">Create your account</h1>
        <p className="text-muted text-sm">
          Registration is not connected yet. This screen holds the space where account creation will
          be introduced in an upcoming change.
        </p>
      </div>
      <p className="text-muted text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-accent font-medium hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
