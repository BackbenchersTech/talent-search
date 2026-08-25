import { Education } from '@/lib/data/education/educationTypes';
import { Profile } from '@/lib/data/profiles/profileTypes';
import { EducationSection } from './EducationSection';
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

      {/* TODO: ExperienceSection */}
      {/* Summary/timeline of all positions with option to view more details  */}

      <EducationSection profileId={profileId} education={education} editable={editable} />
    </section>
  );
};
