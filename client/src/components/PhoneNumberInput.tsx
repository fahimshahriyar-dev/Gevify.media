import ReactPhoneInput from "react-phone-input-2";

// Vite/esbuild CJS interop may resolve the default import to the
// namespace object `{ default: Component }` instead of the component.
const PhoneInput =
  (ReactPhoneInput as unknown as { default?: typeof ReactPhoneInput })
    .default ?? ReactPhoneInput;

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
}

const toE164 = (formattedValue: string) =>
  formattedValue.replace(/[^\d+]/g, "");

const PhoneNumberInput = ({
  value,
  onChange,
  placeholder,
}: PhoneNumberInputProps) => {
  return (
    <div className="gevify-phone-input">
      <PhoneInput
        country="bd"
        value={value}
        onChange={(_value, _data, _event, formattedValue) =>
          onChange?.(toE164(formattedValue ?? ""))
        }
        placeholder={placeholder}
      />
    </div>
  );
};

export const isValidWhatsAppNumber = (value?: string): boolean =>
  typeof value === "string" && /^\+[1-9]\d{7,14}$/.test(value);

export default PhoneNumberInput;