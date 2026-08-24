import { Badge } from '@/components/ui/badge';
import { Education } from '@/lib/data/education/educationTypes';
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
        <h3 className='font-medium text-black'>
          <strong>Summary</strong>
        </h3>

        <p className='text-gray-600'>{bio}</p>
      </section>

      {/* Skills section */}
      {skills?.length && (
        <section className='mb-4'>
          <h3 className='font-medium text-black'>
            <strong>Skills</strong>
          </h3>

          <p className='text-gray-600'>
            {skills.map((skill, idx) => (
              <Badge key={`skill-${idx}`} className='mr-1 bg-gray-200 text-black'>
                {skill}
              </Badge>
            ))}
          </p>
        </section>
      )}

      {/* 3 highlighted/curated experiences */}
      {/* Summary/timeline of all positions with option to view more details  */}
      {/* Education section */}
      {education.length && (
        <section>
          <h3 className='font-medium text-black'>
            <strong>Education</strong>
          </h3>

          <ul>
            {education.map((edu, idx) => (
              <li key={`education-${idx}`} className='mb-2'>
                <span>
                  {edu.degree}
                  {edu.fieldOfStudy ? `; ${edu.fieldOfStudy}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
};
