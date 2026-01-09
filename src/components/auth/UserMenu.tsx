import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function UserMenu() {
  return (
    <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
          SA
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">System Administrator</span>
      </div>
    </Button>
  );
}