import DeleteSVG from "../../assets/svg/delete.svg"
import { SvgController } from "../svgController"

export const LocalAudioListController = () => {
    return (
        <ul
          className="transition-transform duration-500 ease-in-out flex flex-col gap-1 "
        >
            <li
              className="flex flex-row justify-between items-center p-2 border-2 cursor-pointer hover:bg-gray-100 border-gray-500"
            >
              <p>local audio file</p>
              <SvgController
                src={DeleteSVG}
                alt="Видалити з кешу"
              />
            </li>
        </ul>
    )
}