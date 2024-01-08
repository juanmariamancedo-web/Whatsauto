export type ReduxState = {
    theme: {
        theme: "light" | "dark"
    },
    avatar: {
        style: string,
        seed: string
    }
}

export type ReduxAction = {
    type: "toggle theme" | "change to dark" | "change to light" | "close settings cookies" | "open setting cookies" | "change style avatar" | "change seed avatar",
    style: string,
    seed: string
}