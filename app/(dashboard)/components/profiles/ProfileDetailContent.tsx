import { Education } from '@/lib/data/education/educationTypes';
import { Experience } from '@/lib/data/experiences/experienceTypes';
import { Profile } from '@/lib/data/profiles/profileTypes';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { SummarySection } from './SummarySection';

interface ProfileDetailContentProps {
  profile: Profile;
  education: Education[];
  experiences: Experience[];
  editable?: boolean;
}

export const ProfileDetailContent = ({
  profile,
  education,
  experiences,
  editable = false,
}: ProfileDetailContentProps) => {
  const { id: profileId, bio, skills } = profile;

  return (
    <section className='mt-8'>
      <SummarySection profileId={profileId} bio={bio} editable={editable} />

      <SkillsSection profileId={profileId} skills={skills} editable={editable} />

      <ExperienceSection
        profileId={profileId}
        experiences={experiences}
        editable={editable}
      />

      <EducationSection profileId={profileId} education={education} editable={editable} />
    </section>
  );
};
