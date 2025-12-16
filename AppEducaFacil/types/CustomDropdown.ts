export interface PropsCustomDropdown {
    label: string;
    options: string[];
    value: string | null;
    onChange: (value: string | null) => void;
}