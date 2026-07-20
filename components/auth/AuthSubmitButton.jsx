import React from 'react';
import { Button } from "@/components/ui/button";

export default function AuthSubmitButton({ loading, defaultText, loadingText }) {
  return (
    <Button 
      type="submit" 
      disabled={loading} 
      className="cursor-pointer w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-md px-4 py-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
    >
      {loading ? loadingText : defaultText}
    </Button>
  );
}
