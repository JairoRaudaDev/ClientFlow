import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-dvh items-center justify-center">
      <Container className="flex max-w-md flex-col items-center gap-4 text-center">
        <p className="text-accent text-sm font-semibold">404</p>
        <h1 className="text-foreground text-2xl font-semibold">Page not found</h1>
        <p className="text-muted text-sm">
          The page you are looking for does not exist or may have moved.
        </p>
        <ButtonLink href="/">Back to home</ButtonLink>
      </Container>
    </main>
  );
}
