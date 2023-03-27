import { WithContext, Thing } from 'schema-dts'

const StructuredData = <T extends Thing>({
	data
}: {
	data: WithContext<T>
}) => (
	<script
		type="application/ld+json"
		dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
	/>
)

export default StructuredData
