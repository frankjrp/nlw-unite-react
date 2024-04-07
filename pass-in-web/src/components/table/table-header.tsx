import { ComponentProps } from "react";

interface TableHeaderProps extends ComponentProps<'th'> {
    width?: number
}

export function TableHeader({width, ...props}: TableHeaderProps) {
    return (
        <th 
            {...props} 
            className={width 
                ? `py-3 px-4 text-sm font-semibold text-left w-${width}` 
                : `py-3 px-4 text-sm font-semibold text-left`
            }
        />
    )
}