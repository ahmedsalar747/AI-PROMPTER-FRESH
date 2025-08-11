export interface InputField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface Task {
  id: string;
  name: string;
  inputs: InputField[];
  promptTemplate: (inputs: Record<string, string>) => string;
}

export interface Role {
  id: string;
  name: string;
  tasks: Task[];
}

export interface ArchitectData {
  roles: Role[];
}

export const architectData: ArchitectData = {
  roles: [
    {
      id: 'programmer',
      name: 'برنامه‌نویس',
      tasks: [
        {
          id: 'generate_code',
          name: 'تولید کد',
          inputs: [
            { 
              id: 'language', 
              name: 'زبان برنامه‌نویسی', 
              type: 'text', 
              placeholder: 'مثلا Python, JavaScript',
              required: true
            },
            { 
              id: 'functionality', 
              name: 'عملکرد مورد نظر', 
              type: 'textarea', 
              placeholder: 'توضیح دهید کد چه کاری باید انجام دهد',
              required: true
            },
            { 
              id: 'libraries', 
              name: 'کتابخانه‌های مورد استفاده (اختیاری)', 
              type: 'text', 
              placeholder: 'مثلا React, Pandas' 
            }
          ],
          promptTemplate: (inputs) => `کاربر می‌خواهد به عنوان یک برنامه‌نویس ماهر در زبان ${inputs.language || 'مشخص نشده'}، کدی تولید کند که عملکرد زیر را داشته باشد: "${inputs.functionality}". در صورت امکان از کتابخانه‌های ${inputs.libraries || 'پیش‌فرض یا مناسب'} استفاده شود.`
        },
        {
          id: 'debug_code',
          name: 'اشکال‌زدایی کد',
          inputs: [
            { 
              id: 'language', 
              name: 'زبان برنامه‌نویسی', 
              type: 'text', 
              placeholder: 'مثلا Python, JavaScript',
              required: true
            },
            { 
              id: 'code_snippet', 
              name: 'قطعه کد دارای اشکال', 
              type: 'textarea', 
              placeholder: 'کد خود را اینجا وارد کنید',
              required: true
            },
            { 
              id: 'error_message', 
              name: 'پیغام خطا (اختیاری)', 
              type: 'text', 
              placeholder: 'پیغام خطای دریافتی' 
            },
            { 
              id: 'desired_behavior', 
              name: 'رفتار مورد انتظار', 
              type: 'textarea', 
              placeholder: 'توضیح دهید کد باید چگونه کار کند',
              required: true
            }
          ],
          promptTemplate: (inputs) => `کاربر به عنوان یک برنامه‌نویس با مشکل اشکال‌زدایی در زبان ${inputs.language || 'مشخص نشده'} مواجه شده است. قطعه کد به شرح زیر است: \n\`\`\`${inputs.language || ''}\n${inputs.code_snippet}\n\`\`\`\n${inputs.error_message ? `پیغام خطای دریافتی: "${inputs.error_message}"\n` : ''}رفتار صحیح و مورد انتظار کد این است: "${inputs.desired_behavior}". لطفاً در شناسایی و رفع اشکال کمک کنید.`
        },
        {
          id: 'optimize_code',
          name: 'بهینه‌سازی کد',
          inputs: [
            { 
              id: 'language', 
              name: 'زبان برنامه‌نویسی', 
              type: 'text', 
              placeholder: 'مثلا Python, JavaScript',
              required: true
            },
            { 
              id: 'code_snippet', 
              name: 'کد برای بهینه‌سازی', 
              type: 'textarea', 
              placeholder: 'کد خود را اینجا وارد کنید',
              required: true
            },
            { 
              id: 'optimization_goal', 
              name: 'هدف بهینه‌سازی', 
              type: 'select',
              options: [
                { value: 'performance', label: 'بهبود کارایی' },
                { value: 'readability', label: 'بهبود خوانایی' },
                { value: 'memory', label: 'کاهش مصرف حافظه' },
                { value: 'security', label: 'افزایش امنیت' }
              ],
              required: true
            }
          ],
          promptTemplate: (inputs) => `کاربر قصد دارد کد زیر را در زبان ${inputs.language || 'مشخص نشده'} بهینه‌سازی کند:\n\`\`\`${inputs.language || ''}\n${inputs.code_snippet}\n\`\`\`\nهدف اصلی بهینه‌سازی: ${inputs.optimization_goal}. لطفاً پیشنهادات بهینه‌سازی ارائه دهید.`
        }
      ]
    },
    {
      id: 'marketer',
      name: 'بازاریاب',
      tasks: [
        {
          id: 'ad_copy',
          name: 'نوشتن متن تبلیغاتی',
          inputs: [
            { 
              id: 'product', 
              name: 'محصول/خدمت', 
              type: 'text', 
              placeholder: 'نام محصول یا خدمت',
              required: true
            },
            { 
              id: 'audience', 
              name: 'مخاطب هدف', 
              type: 'text', 
              placeholder: 'مثلا جوانان، متخصصان فنی',
              required: true
            },
            { 
              id: 'key_message', 
              name: 'پیام کلیدی', 
              type: 'textarea', 
              placeholder: 'مهمترین نکته‌ای که باید منتقل شود',
              required: true
            },
            { 
              id: 'platform', 
              name: 'پلتفرم انتشار', 
              type: 'select',
              options: [
                { value: 'instagram', label: 'اینستاگرام' },
                { value: 'facebook', label: 'فیس‌بوک' },
                { value: 'linkedin', label: 'لینکدین' },
                { value: 'website', label: 'وب‌سایت' },
                { value: 'email', label: 'ایمیل' },
                { value: 'other', label: 'سایر' }
              ]
            }
          ],
          promptTemplate: (inputs) => `کاربر به عنوان یک بازاریاب قصد دارد یک متن تبلیغاتی برای محصول/خدمت "${inputs.product}" بنویسد. مخاطب هدف "${inputs.audience}" است و پیام کلیدی که باید منتقل شود این است: "${inputs.key_message}". ${inputs.platform ? `این متن برای انتشار در پلتفرم "${inputs.platform}" در نظر گرفته شده است.` : ''} لطفاً یک متن تبلیغاتی جذاب و موثر تهیه کنید.`
        },
        {
          id: 'social_media_strategy',
          name: 'استراتژی شبکه‌های اجتماعی',
          inputs: [
            { 
              id: 'brand', 
              name: 'برند/شرکت', 
              type: 'text', 
              placeholder: 'نام برند یا شرکت',
              required: true
            },
            { 
              id: 'target_audience', 
              name: 'مخاطب هدف', 
              type: 'text', 
              placeholder: 'توصیف دقیق مخاطب هدف',
              required: true
            },
            { 
              id: 'goals', 
              name: 'اهداف کمپین', 
              type: 'textarea', 
              placeholder: 'اهداف اصلی کمپین شبکه‌های اجتماعی',
              required: true
            },
            { 
              id: 'budget', 
              name: 'بودجه تقریبی', 
              type: 'select',
              options: [
                { value: 'low', label: 'کم (زیر 5 میلیون)' },
                { value: 'medium', label: 'متوسط (5-20 میلیون)' },
                { value: 'high', label: 'بالا (بالای 20 میلیون)' }
              ]
            }
          ],
          promptTemplate: (inputs) => `کاربر به عنوان بازاریاب برند "${inputs.brand}" نیاز به یک استراتژی شبکه‌های اجتماعی دارد. مخاطب هدف: "${inputs.target_audience}". اهداف کمپین: "${inputs.goals}". ${inputs.budget ? `بودجه تقریبی: ${inputs.budget}.` : ''} لطفاً یک استراتژی کامل و عملی ارائه دهید.`
        }
      ]
    },
    {
      id: 'content_creator',
      name: 'تولید کننده محتوا',
      tasks: [
        {
          id: 'blog_post',
          name: 'نوشتن مقاله وبلاگ',
          inputs: [
            { 
              id: 'topic', 
              name: 'موضوع مقاله', 
              type: 'text', 
              placeholder: 'موضوع اصلی مقاله',
              required: true
            },
            { 
              id: 'keywords', 
              name: 'کلمات کلیدی', 
              type: 'text', 
              placeholder: 'کلمات کلیدی مهم برای SEO' 
            },
            { 
              id: 'tone', 
              name: 'لحن نوشتار', 
              type: 'select',
              options: [
                { value: 'professional', label: 'حرفه‌ای' },
                { value: 'casual', label: 'غیررسمی' },
                { value: 'educational', label: 'آموزشی' },
                { value: 'entertaining', label: 'سرگرم‌کننده' }
              ]
            },
            { 
              id: 'length', 
              name: 'طول مقاله', 
              type: 'select',
              options: [
                { value: 'short', label: 'کوتاه (300-500 کلمه)' },
                { value: 'medium', label: 'متوسط (500-1000 کلمه)' },
                { value: 'long', label: 'بلند (1000+ کلمه)' }
              ]
            }
          ],
          promptTemplate: (inputs) => `کاربر به عنوان تولید کننده محتوا می‌خواهد یک مقاله وبلاگ در موضوع "${inputs.topic}" بنویسد. ${inputs.keywords ? `کلمات کلیدی مهم: "${inputs.keywords}".` : ''} ${inputs.tone ? `لحن نوشتار: ${inputs.tone}.` : ''} ${inputs.length ? `طول مورد نظر: ${inputs.length}.` : ''} لطفاً یک مقاله جامع و جذاب تهیه کنید.`
        }
      ]
    }
  ]
}; 