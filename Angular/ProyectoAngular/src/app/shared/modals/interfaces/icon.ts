import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Icon {
    color: string;
    icon: IconProp;
}

export interface Icons {
    [key: string]: Icon;
}