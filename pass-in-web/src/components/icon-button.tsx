import { ComponentProps } from "react";

interface IconButtonProps extends ComponentProps<'button'> {
    transparent?: boolean
}

export function IconButton({ transparent, ...props }: IconButtonProps) {
    const generalClass = 'border border-white/10 rounded-md p-1.5'
    const background = {
        black: 'bg-black/20',
        white: 'bg-white/10'
    }

    return (
        <button
            {...props}
            className={
                transparent ? `${background.black} ${generalClass}`
                : props.disabled ? `${background.white} ${generalClass} cursor-not-allowed`
                : `${background.white} ${generalClass}`
            }
        /> //Para chamar o 'children', funciona tanto com a chave de fechamento '</button>' quanto assim, mais reduzido.
    )
}

//Poderia usar também a biblioteca 'tailwind-merge', que mescla as classes, ficando assim:
//Importar twMerge from tailwind-merge

/*className = {twMerge(
    'border border-white/10 rounded-md p-1.5',
    transparent ? 'bg-black/20' : 'bg-black/10',
    props.disabled ? 'cursor-not-allowed' : null
)}*/