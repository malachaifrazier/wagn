class Wagn::Renderer
  define_view(:raw, :name=>'*now') do |args|
    Time.now.strftime('%A, %B %d, %Y %I:%M %p %Z')
  end
  alias_view(:raw, {:name=>'*now'}, :core)


  define_view(:raw, :name=>'*version') do |args|
    Wagn::Version.full
  end
  alias_view(:raw, {:name=>'*version'}, :core)

  
  define_view(:raw, :name=>'*alerts') do |args|
    %{<div id="alerts">
      <div id="notice"> #{ flash[:notice] } </div>
      <div id=>"error"> #{ flash[:warning]}#{flash[:error] }</div>
    </div>}
  end
  alias_view(:raw, {:name=>'*alerts'}, :core)
end
