import { DEGREE_LABELS, Education } from '@/lib/data/education/educationTypes';
import { Profile } from '@/lib/data/profiles/profileTypes';
import { SkillsSection } from './SkillsSection';
import { SummarySection } from './SummarySection';

interface ProfileDetailContentProps {
  profile: Profile;
  education: Education[];
  editable?: boolean;
}

export const ProfileDetailContent = ({
  profile,
  education,
  editable = false,
}: ProfileDetailContentProps) => {
  const { id: profileId, bio, skills } = profile;

  return (
    <section className='mt-8'>
      <SummarySection profileId={profileId} bio={bio} editable={editable} />

      <SkillsSection profileId={profileId} skills={skills} editable={editable} />

      {/* 3 highlighted/curated experiences */}
      {/* Summary/timeline of all positions with option to view more details  */}
      {/* Education section */}
      {education.length > 0 && (
        <section>
          <h3 className='font-semibold text-black'>Education</h3>

          <ul className='mt-2'>
            {[...education]
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((edu) => {
                const credential = [DEGREE_LABELS[edu.degree], edu.fieldOfStudy]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <li key={edu.id} className='mb-3'>
                    <p className='font-medium text-black'>{edu.school || credential}</p>
                    {edu.school && <p className='text-sm text-gray-600'>{credential}</p>}
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </section>
  );
};
