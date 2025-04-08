import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Hospital Management System. All rights reserved.
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-4 w-4 fill-current text-red-500" />
          <span>by Your Team</span>
        </div>
      </div>
    </footer>
  );
}
