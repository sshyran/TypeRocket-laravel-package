@extends(config('typerocket.view.extends'))

@section(config('typerocket.view.section'))

    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                @if (!empty($errors) && count($errors) > 0)
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <div class="panel panel-default">
                    <div class="panel-heading">Media Manager</div>

                    <div class="panel-body">
                        <p>
                            <a href="{!! route('media.create') !!}" class="btn btn-default">
                                Upload Media
                            </a>
                        </p>
                        <strong>Filter Media</strong>
                        <form class="form-inline">
                            <div class="form-group">
                                <select name="type">
                                    @foreach (['all' => 'All', 'image' => 'Image', 'pdf' => 'PDF'] as $key => $value)
                                        <option value="{{ $key }}" {{ $key == $filters['type'] ? 'selected="selected"' : '' }}>{{ $value }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="form-group">
                                <input name="search" type="text" placeholder="Search caption" value="{{ $filters['search'] }}">
                            </div>
                            <button type="submit" class="btn btn-default">Filter</button>
                        </form>
                    </div>

                    <table class="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse($media as $item)
                            <tr>
                                <th scope="row">{{$item->id}}</th>
                                <td>
                                    @if(in_array(strtolower($item->ext), ['jpg', 'png', 'gif', 'jpeg']))
                                        <a href="{{ $item->getFullSrc() }}" target="_blank">
                                            <img width="50"
                                                 height="50"
                                                 src="{{ $item->getThumbSrc('?w=150&h=150') }}"
                                                 alt="{{$item->alt}}"
                                            >
                                        </a>
                                    @else
                                        {{ $item->ext }}
                                    @endif
                                </td>
                                <td>
                                    @if(in_array(strtolower($item->ext), ['jpg', 'png', 'gif', 'jpeg']))
                                        <strong>Alt Text:</strong> {{ $item->alt }}
                                        <br>
                                        <strong>Caption:</strong> {{ $item->caption }}
                                    @else
                                        <strong>Name:</strong> {{ $item->caption }}
                                    @endif
                                </td>
                                <td>
                                    @if(in_array(strtolower($item->ext), ['jpg', 'png', 'gif', 'jpeg', 'pdf']))
                                        <a class="btn btn-default" href="/media/{!! $item->id !!}/edit">Edit</a>
                                    @endif
                                    <form style="display: inline;"
                                          method="post"
                                          action="{!! route('media.destroy', ['media' => $item->id]) !!}"
                                    >
                                        {!! csrf_field() !!}
                                        {!! method_field('delete') !!}
                                        <button type="submit" class="btn confirm-action btn-danger">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <th scope="row">0</th>
                                <td colspan="4">No media yet.</td>
                            </tr>
                        @endforelse

                        </tbody>
                    </table>

                    <ul class="list-group">

                    </ul>
                </div>
            </div>

            {!! $media->appends($filters)->render() !!}

        </div>
    </div>

@stop
