import { Restaurant } from "../interfaces/restaurant";
import { DIAS_SEMANA } from "../constants";

export class Utils {

    public testInputExpr(input: HTMLInputElement, regexp: RegExp): boolean {
        input.classList.remove("is-valid", "is-invalid");
        const valid = regexp.test(input.value);
        input.classList.add(valid ? "is-valid" : "is-invalid");
        return valid;
    }

    public validateName(form: HTMLFormElement): boolean {
        return this.testInputExpr((form.name as unknown as HTMLInputElement), /\S/);
    }

    public validateEmail(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.email as unknown as HTMLInputElement, /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a|0-9]){2}\.[a-z]{2,3}$/);

    }

    public validatePhone(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.phone as unknown as HTMLInputElement, /^[0-9]{9}$/);
    }

    public validatePassword(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.password as unknown as HTMLInputElement, /\S/);
    }

    public validateRePassword(form: HTMLFormElement): boolean {
        return (form.password.value == form.password2.value) || (form.password.value == form.password2.value);
    }

    public validateDescription(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.description as unknown as HTMLInputElement, /\S/);
    }

    public validateCuisine(form: HTMLFormElement): boolean {
        return this.testInputExpr(form.cuisine as unknown as HTMLInputElement, /\S/);
    }

    public validateDays(days: HTMLFormElement | Array<string>): boolean {
        if (days instanceof HTMLFormElement) {
            const formDays = days.days;
            const daysError = document.getElementById("daysError");
            if (!formDays.length)
                daysError!.classList.remove("d-none");
            else
                daysError!.classList.add("d-none");
            return formDays.length > 0;
        }
     
        const daysError = document.getElementById("daysError");
        if (!days.length)
            daysError!.classList.remove("d-none");
        else
            daysError!.classList.add("d-none");
        return days.length > 0;
    }


    public validateImage(form: HTMLFormElement): boolean {
        const imgInput = form.image;

        imgInput.classList.remove("is-valid", "is-invalid");
        if (imgInput.files.length > 0) {
            imgInput.classList.add("is-valid");
            return true;
        } else {
            imgInput.classList.add("is-invalid");
            return false;
        }
    }


    public isOpen(restaurant: Restaurant): boolean {
        const todayWeekDay: string = new Date().getDay() + "";
        const isOpen: boolean = restaurant.daysOpen.includes(todayWeekDay) ? true : false;
        return isOpen;
    }


    public isMine(restaurant: Restaurant): boolean {
        return restaurant.creator?.me ?? false;
    }


    public getDaysStr(restaurant: Restaurant, separator = ", "): string {
        const daysOpenStr: string = restaurant.daysOpen
            .map((value) => DIAS_SEMANA[value as unknown as number])
            .join(separator);
        return daysOpenStr;
    }


    public getFullStars<objWithStars extends { stars?: number }>(object: objWithStars): number[] {
        const stars = Math.floor(object.stars ?? 0);
        return new Array<number>(stars).fill(1);
    }


    public getEmptyStars<objWithStars extends { stars?: number }>(object: objWithStars): number[] {
        
        const stars = Math.floor(object.stars ?? 0);
        return new Array<number>(5 - stars).fill(1);
    }


    public getDistanceFormated(restaurant: Restaurant,): number {
        return restaurant.distance !== undefined ? parseFloat(restaurant.distance.toFixed(2)) : 0;
    }

    public generateStars(rating: number): string {
        const fullStar = '<i class="bi bi-star-fill"></i>';
        const emptyStar = '<i class="bi bi-star"></i>';
        const maxStars = 5;
        let stars = '';
    
        for (let i = 0; i < maxStars; i++) {
            stars += i < rating ? fullStar : emptyStar;
        }
    
        return `${stars} ${rating.toFixed(2)}`;
    }


    static imagePreview(input: HTMLInputElement): void {
        
        const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;

        input.addEventListener("change", async (event: Event) => {
            //console.log("<Change detected>");

            const inputElement = event.target as HTMLInputElement;
            if (!inputElement.files || inputElement.files.length === 0) return;
            const file = inputElement.files[0];
            const img64 = await this.imageTo64(file);

            if (img64) {
                imgPreview.src = img64;
                imgPreview.classList.remove("d-none");
            } else {
                imgPreview.classList.add("d-none");
            }
        });
    }


    static async imageTo64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            if (file && (file.type === "image/png" || file.type === "image/jpg"  || file.type === "image/jpeg")) {
                reader.readAsDataURL(file);
                reader.onload = (): void => {
                    resolve(reader.result as string);
                };
                reader.onerror = (error): void => {
                    reject(error);
                };
            } else {
                resolve("");
            }
        });
    }
}
