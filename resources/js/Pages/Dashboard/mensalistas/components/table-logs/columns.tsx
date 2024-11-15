import { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { useDiologLog } from "./useDiologLog"



export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "created_at",
    header: "Data de criação",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "properties.agent.ip",
    header: "IP",
  },
  {
    accessorKey: "properties",
    header: "",
    cell: (row) => {
      const  { setLog } = useDiologLog();
      return (
        <div className="flex justify-end">
          <button className="btn btn-sm btn-primary" onClick={() => setLog(row.getValue())}>
            <Eye className="size-6" />
          </button>
        </div>
      )
    }
  }
]
