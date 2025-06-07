import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Flag, UserX, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileActionsProps {
  userId: string;
  userName?: string;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ userId, userName = 'User' }) => {
  const { toast } = useToast();

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: `Thank you for reporting ${userName}. We'll review this profile.`,
    });
  };

  const handleBlock = () => {
    toast({
      title: "User Blocked",
      description: `${userName} has been blocked and won't appear in your feed.`,
    });
  };

  const handleHide = () => {
    toast({
      title: "Profile Hidden",
      description: `${userName} has been hidden from your feed.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleReport} className="text-red-600">
          <Flag className="mr-2 h-4 w-4" />
          Report Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleBlock} className="text-red-600">
          <UserX className="mr-2 h-4 w-4" />
          Block User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleHide}>
          <EyeOff className="mr-2 h-4 w-4" />
          Hide Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileActions;