@extends('layouts.app')

@section('content')
  @php
    echo do_blocks('
      <!-- wp:event/hero /-->
      <!-- wp:event/services-grid /-->
    ');
  @endphp
@endsection
