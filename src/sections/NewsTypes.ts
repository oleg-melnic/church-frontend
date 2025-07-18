export interface NewsItem {
  date: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface SocialIcon {
  svg: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface ServiceSchedule {
  liturgy: string;
  vespers: string;
  prayer: string;
}
