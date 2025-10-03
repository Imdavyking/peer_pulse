import { FaSpinner } from "react-icons/fa";

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  label = "Submit",
}) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-200 ${
      isSubmitting ? "cursor-not-allowed" : "cursor-pointer hover:bg-indigo-700"
    }`}
  >
    {isSubmitting ? <FaSpinner className="w-5 h-5 animate-spin" /> : label}
  </button>
);

export default SubmitButton;
