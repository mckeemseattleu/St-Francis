type FormProps = React.HTMLProps<HTMLFormElement> & {
    children: React.ReactNode;
};

function Form(props: FormProps) {
    const { children, ...rest } = props;
    return <form {...rest}>{children}</form>;
}

export default Form;
