export interface IButtonProps {
    children?: React.ReactNode;
    type: 'button' | 'submit';
    view?: 'default' | 'block';
    className?: string;
    theme: 'normal' | 'pure';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}
