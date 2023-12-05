import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentenceCasePipe } from './sentenceCase/sentence-case.pipe';
import { StripPipe } from './strip/strip.pipe';
import { IsObservablePipe } from './isObservable/is-observable.pipe';
import { MapPipe } from './map/map.pipe';
import { FormatTimePipe } from './formatTime/format-time.pipe';
import { TitlePipe } from './title/title.pipe';
import { IsRoutePipe } from './isRoute/is-route.pipe';

@NgModule({
  declarations: [
    SentenceCasePipe,
    StripPipe,
    IsObservablePipe,
    MapPipe,
    FormatTimePipe,
    TitlePipe,
    IsRoutePipe,
  ],
  exports: [
    SentenceCasePipe,
    StripPipe,
    IsObservablePipe,
    MapPipe,
    FormatTimePipe,
    TitlePipe,
    IsRoutePipe,
  ],
  imports: [CommonModule],
})
export class PipesModule {}
