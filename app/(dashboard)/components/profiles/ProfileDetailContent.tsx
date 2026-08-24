import { Badge } from '@/components/ui/badge';
import { DEGREE_LABELS, Education } from '@/lib/data/education/educationTypes';
import { Profile } from '@/lib/data/profiles/profileTypes';

interface ProfileDetailContentProps {
  profile?: Profile;
  education: Education[];
}

export const ProfileDetailContent = ({
  profile,
  education,
}: ProfileDetailContentProps) => {
  const { bio, skills } = profile || {};

  return (
    <section className='mt-8'>
      {/* Bio section */}
      <section className='mb-4'>
        <h3 className='font-semibold text-black'>Summary</h3>

        <p className='text-gray-600'>{bio}</p>
      </section>

      {/* Skills section */}
      {!!skills?.length && (
        <section className='mb-4'>
          <h3 className='font-semibold text-black'>Skills</h3>

          <p className='text-gray-600'>
            {skills.map((skill) => (
              <Badge key={skill} className='mr-1 bg-gray-200 text-black'>
                {skill}
              </Badge>
            ))}
          </p>
        </section>
      )}

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
