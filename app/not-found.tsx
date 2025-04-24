import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex h-[calc(100vh-200px)] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Страница не найдена</h2>
        <p className="mt-2 text-muted-foreground">
          Извините, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
