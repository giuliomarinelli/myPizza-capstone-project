import { UUID } from "crypto";
import { MenuItemRes } from "./menu-item-res.interface";

export interface MenuRes {
    id: UUID
    item: MenuItemRes
}