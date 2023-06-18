import { Component, Input } from '@angular/core';
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons/faPhoneAlt';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFax } from '@fortawesome/free-solid-svg-icons/faFax';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
})
export class ContactInfoComponent {
  @Input()
  phone: string;
  @Input()
  email: string;
  @Input()
  fax: string;
  @Input()
  mobile: string;

  faPhone = faPhoneAlt;
  faEnvelope = faEnvelope;
  faFax = faFax;
  faMobile = faMobileAlt;

}
