

export interface FormElements extends HTMLFormElement {
    restaurantName: HTMLInputElement;
    description: HTMLInputElement;
    cuisine: HTMLInputElement;
    days: NodeListOf<HTMLInputElement>;
    phone: HTMLInputElement;
    image: HTMLInputElement;
}