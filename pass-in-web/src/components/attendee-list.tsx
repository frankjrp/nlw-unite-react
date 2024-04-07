import { Search, MoreHorizontal, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import axios from 'axios'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

interface Attendee {
    id: string
    name: string
    email: string
    createdAt: string
    checkedInAt: string | null
}

export function AttendeeList() {
    const [total, setTotal] = useState(0)
    const totalPages = Math.ceil(total / 10)
    const [attendees, setAttendees] = useState<Attendee[]>([])
    
    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString())

        if (url.searchParams.has('search')) {
            return url.searchParams.get('search') ?? ''
        }

        return ''
    })

    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

        if (url.searchParams.has('page')) {
            return Number(url.searchParams.get('page'))            
        }

        return 1
    })

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')

        url.searchParams.set('pageIndex', String(page - 1))
        
        if (search.length > 0) {
            url.searchParams.set('query', search)
        }

        axios.get(url.href)
            .then(response => {
                setAttendees(response.data.attendees)
                setTotal(response.data.total)                
            })

        // Com o fetch ficaria assim:
        // fetch(url)
        //     .then(response => response.json())
        //     .then(data => {
        //         setAttendees(data.attendees)
        //         setTotal(data.total)
        //     })

    }, [page, search])

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())

        url.searchParams.set('search', search)

        window.history.pushState({}, "", url)

        setSearch(search)   
    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())

        url.searchParams.set('page', String(page))

        window.history.pushState({}, "", url)

        setPage(page)
    }

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }

    function goToNextPage() {
        setCurrentPage(page + 1)
    }

    function goToPreviousPage() {
        setCurrentPage(page - 1)
    }

    function goToFirstPage() {
        setCurrentPage(1)
    }

    function goToLastPage() {
        setCurrentPage(totalPages)
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg flex items-center gap-3">
                    <Search size={16} className='text-emerald-300' />
                    <input 
                        onChange={onSearchInputChanged} 
                        value={search}
                        className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0" 
                        placeholder="Buscar participante..."
                    />
                </div>
            </div>

            <Table>
                <thead>
                    <tr className='border-b border-white/10'>
                        <TableHeader width={12}>
                            <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
                        </TableHeader>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader width={16}></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id}>
                                <TableCell>
                                    <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs(attendee.createdAt).fromNow()}</TableCell>
                                <TableCell>
                                    {attendee.checkedInAt === null 
                                    ? <span className='text-zinc-500'>Não fez check-in</span>
                                    : dayjs(attendee.checkedInAt).fromNow()}
                                </TableCell>
                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal size={16} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length} de {total} itens
                        </TableCell>
                        <TableCell colSpan={3}>
                            <div className='flex items-center justify-end gap-8'>
                                <span>Página {page} de {totalPages == 0 ? 1 : totalPages}</span>

                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft size={16} />
                                    </IconButton>

                                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                        <ChevronLeft size={16} />
                                    </IconButton>

                                    <IconButton onClick={goToNextPage} disabled={page === totalPages || totalPages === 0}>
                                        <ChevronRight size={16} />
                                    </IconButton>

                                    <IconButton onClick={goToLastPage} disabled={page === totalPages || totalPages === 0}>
                                        <ChevronsRight size={16} />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    )
}