import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Tooltip 컴포넌트 import
import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  required: boolean;
  children: React.ReactNode;
  id: string;
  tooltip?: string; 
}

const FormField = ({ label, required, children, id, tooltip }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor={id} className="flex items-center text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default FormField;
