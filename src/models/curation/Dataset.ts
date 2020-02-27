export interface DatasetCurationOptionHash {
    [key: string]: DatasetCurationOption;
}

export interface DatasetCurationOption {
    text: string;
    value: string;
    color: string;
    icon: string;
}
