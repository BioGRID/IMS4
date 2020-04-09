export interface CurationDrawerLink {
    to: string;
    icon: string;
    text: string;
    subtitle?: string;
}

export interface CurationDrawerHash {
    [key: number]: CurationDrawerLink;
}
