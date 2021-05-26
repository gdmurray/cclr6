import config from '@lib/platform/config'

type Props = {
    description?: string;
    keywords?: string[];
    url: string;
};
export default function BasicMeta(
    {
        description,
        keywords,
        url
    }: Props) {
    return (
        <>
            <meta
                name='description'
                content={description ? description : config.site_description}
            />
            <meta
                name='keywords'
                content={
                    keywords
                        ? keywords.join(',')
                        : config.site_keywords.map((it) => it.keyword).join(',')
                }
            />
            <link rel='canonical' href={config.base_url + url} />
        </>
    )
}
