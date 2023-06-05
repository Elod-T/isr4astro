declare interface ReflectOptions {
  src: string;
  dest: string;
  recursive?: boolean;
  delete?: boolean;
  exclude?: string[];
}

declare interface ReflectReturn {
  res: string;
  err: string;
}

declare module "@alumna/reflect" {
  export default async function reflect(
    options: ReflectOptions
  ): Promise<ReflectReturn>;
}
