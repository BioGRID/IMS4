// Mixin for standardized
// formatting of data displayed in tables

import { Vue, Component } from 'vue-property-decorator';

@Component
export class ElasticExtractor extends Vue {
    // Determine which participant ids correspond to a specific
    // experimental role definition, and return the list of ids
    public extractParticipantIDsByExperimentalRole( entity: any, role: string ): number[] {
        const participantAttributes = entity._source.participant_attributes;
        const participantSet: number[] = [];
        for (const attribute of participantAttributes) {
            if (attribute.attribute_type_id === 28) {
                if (attribute.attribute_text === role) {
                    participantSet.push( attribute.participant_id );
                }
            }
        }

        return participantSet;
    }

    // Return a string representing the name of all participants
    // matching the specific experimental role
    public extractParticipantNamesByExperimentalRole( entity: any, role: string ): string {
        const participantIDs = this.extractParticipantIDsByExperimentalRole(entity, role);
        const participantSet: string[] = [];
        for (const participant of entity._source.participants) {
            if (participantIDs.includes(participant.participant_id)) {
                participantSet.push( participant.name );
            }
        }
        return participantSet.join( ',' );
    }

    // Return a string representing the abbreviation of all organisms
    // matching the specific experimental role
    public extractOrganismAbbreviationByExperimentalRole( entity: any, role: string ): string {
        const participantIDs = this.extractParticipantIDsByExperimentalRole(entity, role);
        const participantSet: string[] = [];
        for (const participant of entity._source.participants) {
            if (participantIDs.includes(participant.participant_id)) {
                participantSet.push( participant.organism.abbreviation );
            }
        }
        return participantSet.join( ',' );
    }

    // Return a string representing the combination of all experimental
    // attributes matching a specific type
    public extractExperimentalKeywordAttributeByShortcode( entity: any, shortcode: string ) {
        return entity._source.keyword_attributes[shortcode].text.join( ',' );
    }

}
