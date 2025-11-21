import Link from 'next/link';

const Branding = () => (
  <div className='flex flex-col justify-between'>
    <div>
      <div className='font-medium'>Example</div>
      <div className='mt-1 flex flex-row items-center gap-0.5 text-sm lg:mt-1.5'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 640 640'
          fill='currentColor'
          stroke='currentColor'
          className='size-3 text-gray-600'
        >
          <path d='M541.9 139.5C546.4 127.7 543.6 114.3 534.7 105.4C525.8 96.5 512.4 93.6 500.6 98.2L84.6 258.2C71.9 263 63.7 275.2 64 288.7C64.3 302.2 73.1 314.1 85.9 318.3L262.7 377.2L321.6 554C325.9 566.8 337.7 575.6 351.2 575.9C364.7 576.2 376.9 568 381.8 555.4L541.8 139.4z' />
        </svg>
        Detroit, MI
      </div>
    </div>

    <div>
      <div className='flex flex-row gap-5 text-gray-400 max-lg:mt-6'>
        {/* Socials */}
        <Link href='https://www.x.com'>
          {/* <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 640 640'
            fill='currentColor'
            stroke='currentColor'
            className='aspect-square size-5 duration-200 hover:text-gray-600'
          >
            <path d='M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z' />
          </svg>
        </Link>

        <Link href='https://www.youtube.com/'>
          {/* <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 640 640'
            fill='currentColor'
            stroke='currentColor'
            className='aspect-square size-5 duration-200 hover:text-gray-600'
          >
            <path d='M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z' />
          </svg>
        </Link>

        <Link href='https://www.linkedin.com/'>
          {/* <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 640 640'
            fill='currentColor'
            stroke='currentColor'
            className='aspect-square size-5 duration-200 hover:text-gray-600'
          >
            <path d='M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96zM165 266.2L231.5 266.2L231.5 480L165 480L165 266.2zM236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160C219.5 160 236.7 177.2 236.7 198.5zM413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480L413.9 480z' />
          </svg>
        </Link>

        <Link href='https://www.instagram.com/'>
          {/* <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 640 640'
            fill='currentColor'
            stroke='currentColor'
            className='aspect-square size-5 duration-200 hover:text-gray-600'
          >
            <path d='M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z' />
          </svg>
        </Link>
      </div>

      <div className='mt-2 text-sm text-gray-400'>&copy; 2025 Example</div>
    </div>
  </div>
);

const FooterSection = ({
  titleClassName = '',
  title,
  links,
}: {
  titleClassName?: string;
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}) => (
  <>
    <div className={`mb-2 text-[15px] font-medium ${titleClassName}`}>{title}</div>
    <div className='flex flex-col gap-1'>
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className='text-left text-[15px] text-gray-600 duration-100 hover:text-gray-500'
        >
          {label}
        </Link>
      ))}
    </div>
  </>
);

export const Footer = () => {
  return (
    <div className='w-full'>
      <div className='w-full py-8 sm:py-12 md:py-20'>
        <div className='sm:hidden'>
          <Branding />
        </div>

        <div className='grid grid-cols-2 gap-4 text-black max-lg:mt-6 sm:grid-cols-4'>
          <div className='hidden sm:flex'>
            <Branding />
          </div>

          <div>
            <FooterSection
              title='For companies'
              links={[{ label: 'Get in touch', href: '#' }]}
            />

            <div className='sm:hidden'>
              <FooterSection
                title='For candidates'
                links={[
                  { label: 'Join the talent', href: '#join' },
                  { label: 'Payment', href: '#payment' },
                ]}
              />
            </div>

            <FooterSection
              titleClassName='mt-6'
              title='Industry experts'
              links={[
                {
                  label: 'Salesforce experts',
                  href: '/salesforce-experts',
                },
                {
                  label: 'MuleSoft experts',
                  href: '/mulesoft-experts',
                },
                {
                  label: 'Data science experts',
                  href: '/data-science-experts',
                },
              ]}
            />
          </div>

          <div>
            <div className='hidden flex-col sm:flex'>
              <FooterSection
                title='For candidates'
                links={[
                  { label: 'Join the talent', href: '#join' },
                  { label: 'Payment', href: '#payment' },
                ]}
              />
            </div>

            <FooterSection
              titleClassName='sm:mt-6'
              title='Support'
              links={[
                {
                  label: 'support@example.com',
                  href: 'mailto:support@example.com',
                },
                {
                  label: 'press@example.com',
                  href: 'mailto:press@example.com',
                },
                {
                  label: 'gtm@example.com',
                  href: 'mailto:gtm@example.com',
                },
              ]}
            />

            <div className='sm:hidden'>
              <FooterSection title='Resources' links={[{ label: 'Blog', href: '#' }]} />
            </div>
          </div>

          <div className='hidden flex-col sm:flex'>
            <FooterSection title='Resources' links={[{ label: 'Blog', href: '#' }]} />
          </div>
        </div>
      </div>
    </div>
  );
};
