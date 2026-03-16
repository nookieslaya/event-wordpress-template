@extends('layouts.app')

@section('content')
  @php
    echo do_blocks('
      <!-- wp:event/hero /-->
      <!-- wp:event/story-split /-->
      <!-- wp:event/services-grid /-->
      <!-- wp:event/services-showcase /-->
      <!-- wp:event/visual-highlights /-->
      <!-- wp:event/technology-grid /-->
      <!-- wp:event/by-the-numbers /-->
      <!-- wp:event/about-spotlight /-->
      <!-- wp:event/contact-section /-->
    ');
  @endphp
@endsection
