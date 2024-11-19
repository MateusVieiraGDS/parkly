import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { Bell, Car, Package2 } from "lucide-react"

export const LeftMenuHeader = ({}) => {
    return (
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Car className="h-10 w-10" />
              <span className="ml-1 text-2xl font-bold">Parkly</span>
            </Link>
          </div>
    )
}